<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed demo users
        $this->seed();
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'doctor@hospital.local',
            'password' => 'password123',
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'success',
            'message',
            'token',
            'user' => ['id', 'name', 'email', 'role', 'status'],
        ]);
        $response->assertJson([
            'success' => true,
            'user' => [
                'email' => 'doctor@hospital.local',
                'role' => 'doctor',
                'status' => 'active',
            ],
        ]);
        $this->assertNotEmpty($response->json('token'));
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'doctor@hospital.local',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'message' => 'Invalid email or password.',
        ]);
    }

    public function test_user_cannot_login_with_unregistered_email(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'unknown@hospital.local',
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
        ]);
    }

    public function test_login_validation_errors(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'success',
            'message',
            'errors' => ['email', 'password'],
        ]);
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::where('email', 'doctor@hospital.local')->update(['status' => 'inactive']);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'doctor@hospital.local',
            'password' => 'password123',
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
        ]);
    }

    public function test_authenticated_user_can_fetch_profile(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'superadmin@hospital.local',
            'password' => 'password123',
        ]);

        $token = $loginResponse->json('token');

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/auth/me');

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'user' => [
                'email' => 'superadmin@hospital.local',
                'role' => 'superadmin',
            ],
        ]);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'nurse@hospital.local',
            'password' => 'password123',
        ]);

        $token = $loginResponse->json('token');

        $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/logout');

        $logoutResponse->assertOk();
        $logoutResponse->assertJson([
            'success' => true,
            'message' => 'Successfully logged out',
        ]);

        $this->app['auth']->forgetGuards();

        // Attempting to access /me with revoked token should now fail
        $subsequentResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/auth/me');

        $subsequentResponse->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/v1/auth/me');
        $response->assertStatus(401);
    }
}
