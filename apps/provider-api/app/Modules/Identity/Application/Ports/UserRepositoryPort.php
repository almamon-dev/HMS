<?php

declare(strict_types=1);

namespace App\Modules\Identity\Application\Ports;

use App\Modules\Identity\Domain\Entities\UserAccount;

interface UserRepositoryPort
{
    public function findById(string $id): ?UserAccount;

    public function findByEmail(string $email): ?UserAccount;

    public function save(UserAccount $entity): void;
}
