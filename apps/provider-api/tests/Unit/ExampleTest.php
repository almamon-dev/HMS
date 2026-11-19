<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Modules\Foundation\Domain\ValueObjects\Id;
use App\Modules\Foundation\Domain\ValueObjects\Money;
use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    public function test_money_and_id_value_objects(): void
    {
        $id = Id::from('test-uuid-123');
        $this->assertSame('test-uuid-123', (string) $id);

        $money = Money::fromMajorUnits(150.50, 'BDT');
        $this->assertSame(15050, $money->amountInCents);
        $this->assertSame(150.50, $money->toMajorUnits());
        $this->assertSame('BDT', $money->currency);
    }
}
