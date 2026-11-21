<?php

declare(strict_types=1);

namespace App\Modules\Identity\Domain\Entities;

use App\Modules\Identity\Domain\ValueObjects\UserRole;

final readonly class UserAccount
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public UserRole $role,
        public string $status = 'active'
    ) {}
}
