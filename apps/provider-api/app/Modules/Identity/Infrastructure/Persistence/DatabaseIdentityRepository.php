<?php

declare(strict_types=1);

namespace App\Modules\Identity\Infrastructure\Persistence;

use App\Modules\Identity\Application\Ports\UserRepositoryPort;
use App\Modules\Identity\Domain\Entities\UserAccount;

final class DatabaseIdentityRepository implements UserRepositoryPort
{
    public function findById(string $id): ?UserAccount
    {
        return null;
    }

    public function save(UserAccount $entity): void {}
}
