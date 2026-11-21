<?php

declare(strict_types=1);

namespace App\Modules\Identity\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Identity\Application\Ports\UserRepositoryPort;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

final class IdentityController extends Controller
{
    public function __construct(private readonly UserRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Identity',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', 'min:4'],
        ]);

        if ($validator->fails()) {
            return new JsonResponse([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim((string) $request->input('email')));
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check((string) $request->input('password'), (string) $user->password)) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if (isset($user->status) && $user->status !== 'active') {
            return new JsonResponse([
                'success' => false,
                'message' => 'Your account is currently inactive. Please contact administration.',
            ], 403);
        }

        $token = $user->createToken('auth-token', [$user->role ?? 'patient'])->plainTextToken;

        return new JsonResponse([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'patient',
                'status' => $user->status ?? 'active',
            ],
        ], 200);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return new JsonResponse([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'patient',
                'status' => $user->status ?? 'active',
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user && method_exists($user, 'currentAccessToken') && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return new JsonResponse([
            'success' => true,
            'message' => 'Successfully logged out',
        ]);
    }
}
