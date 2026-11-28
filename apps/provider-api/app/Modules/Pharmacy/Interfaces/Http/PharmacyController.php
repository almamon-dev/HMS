<?php

declare(strict_types=1);

namespace App\Modules\Pharmacy\Interfaces\Http;

use App\Http\Controllers\Controller;
use App\Modules\Pharmacy\Application\Ports\PharmacyRepositoryPort;
use App\Modules\Pharmacy\Infrastructure\Persistence\PharmacyAuditLogModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PharmacyController extends Controller
{
    public function __construct(private readonly PharmacyRepositoryPort $repository) {}

    public function status(): JsonResponse
    {
        return new JsonResponse([
            'module' => 'Pharmacy',
            'status' => 'active',
            'adapter' => get_class($this->repository),
        ]);
    }

    /**
     * Authorize and approve a purchase order with Separation of Duties enforcement.
     */
    public function approvePurchaseOrder(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $creatorUserId = $request->input('creator_user_id');

        // Enforce Separation of Duties: Creator cannot approve their own order
        if ($creatorUserId && (string) $creatorUserId === (string) $user?->id) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Separation of duties violation: The creator of a purchase order cannot authorize or approve their own order. An independent Pharmacy Manager or Admin is required.',
            ], 422);
        }

        // Log audit event
        PharmacyAuditLogModel::create([
            'user_id' => $user?->id,
            'action' => 'purchases.approve',
            'module' => 'purchases',
            'entity_type' => 'PurchaseOrder',
            'entity_id' => $id,
            'details' => [
                'po_id' => $id,
                'approver_email' => $user?->email,
                'timestamp' => now()->toIso8601String(),
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return new JsonResponse([
            'success' => true,
            'message' => "Purchase order [{$id}] verified and authorized successfully.",
            'po_id' => $id,
            'approved_by' => $user?->name,
        ]);
    }

    /**
     * Get authorized pharmaceutical suppliers & manufacturers.
     */
    public function getSuppliers(Request $request): JsonResponse
    {
        $suppliers = [
            ['id' => 'SUP-01', 'name' => 'Square Pharmaceuticals Ltd.', 'code' => 'SQUARE', 'contactPerson' => 'Md. Kamrul Islam', 'phone' => '+880 1711-223344', 'email' => 'orders@squarepharma.com.bd', 'drugLicense' => 'DL-DH-1002', 'status' => 'Active'],
            ['id' => 'SUP-02', 'name' => 'Beximco Pharmaceuticals Ltd.', 'code' => 'BEXIMCO', 'contactPerson' => 'Farhan Ahmed', 'phone' => '+880 1712-334455', 'email' => 'sales@beximcopharma.com', 'drugLicense' => 'DL-DH-1003', 'status' => 'Active'],
            ['id' => 'SUP-03', 'name' => 'Incepta Pharmaceuticals Ltd.', 'code' => 'INCEPTA', 'contactPerson' => 'Dr. Tariq Mahmud', 'phone' => '+880 1713-445566', 'email' => 'institutional@inceptapharma.com', 'drugLicense' => 'DL-DH-1004', 'status' => 'Active'],
            ['id' => 'SUP-04', 'name' => 'Renata Limited', 'code' => 'RENATA', 'contactPerson' => 'SM Kabir', 'phone' => '+880 1714-556677', 'email' => 'supply@renata-ltd.com', 'drugLicense' => 'DL-DH-1005', 'status' => 'Active'],
            ['id' => 'SUP-05', 'name' => 'Acme Laboratories Ltd.', 'code' => 'ACME', 'contactPerson' => 'Zahidul Hassan', 'phone' => '+880 1715-667788', 'email' => 'orders@acmelab.com', 'drugLicense' => 'DL-DH-1006', 'status' => 'Active'],
            ['id' => 'SUP-06', 'name' => 'Eskayef Pharmaceuticals Ltd.', 'code' => 'SKF', 'contactPerson' => 'M. Rahman', 'phone' => '+880 1716-778899', 'email' => 'info@skfbd.com', 'drugLicense' => 'DL-DH-1007', 'status' => 'Active'],
            ['id' => 'SUP-07', 'name' => 'Opsonin Pharma Ltd.', 'code' => 'OPSONIN', 'contactPerson' => 'Shah Alam', 'phone' => '+880 1717-889900', 'email' => 'orders@opsonin.com.bd', 'drugLicense' => 'DL-DH-1008', 'status' => 'Active'],
            ['id' => 'SUP-08', 'name' => 'Aristopharma Ltd.', 'code' => 'ARISTO', 'contactPerson' => 'Nurul Amin', 'phone' => '+880 1718-990011', 'email' => 'sales@aristopharma.com', 'drugLicense' => 'DL-DH-1009', 'status' => 'Active'],
            ['id' => 'SUP-09', 'name' => 'Healthcare Pharmaceuticals Ltd.', 'code' => 'HEALTHCARE', 'contactPerson' => 'Tanvir Hossain', 'phone' => '+880 1719-112233', 'email' => 'supplies@hpl.com.bd', 'drugLicense' => 'DL-DH-1010', 'status' => 'Active'],
            ['id' => 'SUP-10', 'name' => 'Sanofi Bangladesh Ltd.', 'code' => 'SANOFI', 'contactPerson' => 'Mahmudul Haque', 'phone' => '+880 1720-223344', 'email' => 'institutional@sanofi.com.bd', 'drugLicense' => 'DL-DH-1011', 'status' => 'Active'],
        ];

        return new JsonResponse([
            'success' => true,
            'data' => $suppliers,
            'total' => count($suppliers),
        ]);
    }

    /**
     * Register a new supplier / pharmaceutical company.
     */
    public function storeSupplier(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:30',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'drug_license' => 'nullable|string|max:100',
            'trade_license' => 'nullable|string|max:100',
            'payment_terms' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:150',
        ]);

        $user = $request->user();

        // Audit log
        PharmacyAuditLogModel::create([
            'user_id' => $user?->id,
            'action' => 'purchases.create',
            'module' => 'purchases',
            'entity_type' => 'Supplier',
            'entity_id' => 'SUP-' . strtoupper(substr(md5($validated['name']), 0, 6)),
            'details' => [
                'company_name' => $validated['name'],
                'contact_person' => $validated['contact_person'] ?? null,
                'phone' => $validated['phone'],
                'created_by' => $user?->name,
                'timestamp' => now()->toIso8601String(),
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return new JsonResponse([
            'success' => true,
            'message' => "Pharmaceutical company [{$validated['name']}] registered successfully.",
            'data' => array_merge($validated, [
                'id' => 'SUP-' . strtoupper(substr(md5($validated['name']), 0, 6)),
                'status' => 'Active',
            ]),
        ], 201);
    }
}
