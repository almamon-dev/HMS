# CarrierDirect — Provider API

Self-contained Carrier & Logistics platform API built with Modular Clean Architecture (Domain-Driven Design).

## Architectural Boundaries

Dependencies point strictly inward:
```
Interfaces / Infrastructure -> Application -> Domain
```

- **Domain:** Pure business logic, entities, value objects, domain exceptions. Zero framework dependencies.
- **Application:** Use cases, DTOs, and ports (interfaces).
- **Infrastructure:** Eloquent models, database repositories, external adapters.
- **Interfaces:** HTTP Controllers, console commands, request validators.
- **Providers:** ServiceProviders binding ports to infrastructure implementations.

Enforced by `deptrac.yaml` and Larastan (Level 8).

## Modules

### Core Business
- `Shipment`
- `Rfq` (Request for Quotation)
- `Quotation`
- `Order`
- `Dispatch`
- `Tracking`
- `Pod` (Proof of Delivery)

### Supporting Domains
- `Foundation` (Shared primitives, Clock, UUIDv7, Value Objects)
- `Identity` (User accounts, roles)
- `Company` (Shipper, Carrier, Broker)
- `Driver` (Driver profiles, license, status)
- `Fleet` (Vehicles, capacity, status)
- `Notification` (SMS, Email, Push)
- `Payment` (Transactions, gateway adapter)
- `Subscription` (Tiers, billing)

## Development & Verification

Run all verification gates from the root:
```bash
make verify
```
This runs:
1. `Pint` (PSR-12 formatting check)
2. `Deptrac` (Clean Architecture boundary enforcement)
3. `Larastan` (Level 8 static analysis)
4. `PHPUnit` (Automated test suite)
