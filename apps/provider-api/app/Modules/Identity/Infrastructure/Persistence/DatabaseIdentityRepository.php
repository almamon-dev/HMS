<?php

declare(strict_types=1);

namespace App\Modules\Identity\Infrastructure\Persistence;

use App\Models\User;
use App\Modules\Identity\Application\Ports\UserRepositoryPort;
use App\Modules\Identity\Domain\Entities\UserAccount;
use App\Modules\Identity\Domain\ValueObjects\UserRole;

final class DatabaseIdentityRepository implements UserRepositoryPort
{
    public function findById(string $id): ?UserAccount
    {
        $user = User::find($id);
        if (! $user) {
            return null;
        }

        return new UserAccount(
            id: (string) $user->id,
            name: (string) $user->name,
            email: (string) $user->email,
            role: UserRole::tryFrom((string) $user->role) ?? UserRole::PATIENT,
            status: (string) ($user->status ?? 'active')
        );
    }

    public function findByEmail(string $email): ?UserAccount
    {
        $user = User::where('email', strtolower(trim($email)))->first();
        if (! $user) {
            return null;
        }

        return new UserAccount(
            id: (string) $user->id,
            name: (string) $user->name,
            email: (string) $user->email,
            role: UserRole::tryFrom((string) $user->role) ?? UserRole::PATIENT,
            status: (string) ($user->status ?? 'active')
        );
    }

    public function save(UserAccount $entity): void
    {
        User::updateOrCreate(
            ['id' => $entity->id],
            [
                'name' => $entity->name,
                'email' => $entity->email,
                'role' => $entity->role->value,
                'status' => $entity->status,
            ]
        );
    }
}
