<?php

declare(strict_types=1);

namespace App\Modules\Pathology\Domain\Entities;

use App\Modules\Pathology\Domain\ValueObjects\TestStatus;

final readonly class PathologyTest
{
    public function __construct(
        public string $id,
        public string $patientId,
        public string $testName,
        public string $sampleCode,
        public TestStatus $status
    ) {}
}
