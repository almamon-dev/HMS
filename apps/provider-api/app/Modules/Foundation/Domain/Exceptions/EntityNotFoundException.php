<?php

declare(strict_types=1);

namespace App\Modules\Foundation\Domain\Exceptions;

class EntityNotFoundException extends DomainException
{
    public static function for(string $entityName, string $id): self
    {
        return new self("{$entityName} with ID '{$id}' was not found.");
    }
}
