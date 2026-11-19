<?php

declare(strict_types=1);

namespace App\Modules\Pathology\Domain\ValueObjects;

enum TestStatus: string
{
    case SAMPLE_COLLECTED = 'sample_collected';
    case PROCESSING = 'processing';
    case REPORT_READY = 'report_ready';
}
