<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with demo users matching all hospital portal roles.
     */
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        $demoUsers = [
            [
                'name' => 'Prof. Dr. M. A. Rashid',
                'email' => 'superadmin@hospital.local',
                'role' => 'superadmin',
                'phone' => '+8801711000001',
            ],
            [
                'name' => 'Hospital Administrator',
                'email' => 'admin@hospital.local',
                'role' => 'admin',
                'phone' => '+8801711000002',
            ],
            [
                'name' => 'Prof. Dr. Tanvir Ahmed',
                'email' => 'doctor@hospital.local',
                'role' => 'doctor',
                'phone' => '+8801711000003',
            ],
            [
                'name' => 'Sister Anowara Begum',
                'email' => 'nurse@hospital.local',
                'role' => 'nurse',
                'phone' => '+8801711000004',
            ],
            [
                'name' => 'Md. Rafiqul Islam',
                'email' => 'pharmacist@hospital.local',
                'role' => 'pharmacist',
                'phone' => '+8801711000005',
            ],
            [
                'name' => 'Dr. Farhana Yasmin',
                'email' => 'pathologist@hospital.local',
                'role' => 'pathologist',
                'phone' => '+8801711000006',
            ],
            [
                'name' => 'Dr. Shamsul Alam',
                'email' => 'radiologist@hospital.local',
                'role' => 'radiologist',
                'phone' => '+8801711000007',
            ],
            [
                'name' => 'Kazi Nazmul Huda',
                'email' => 'accountant@hospital.local',
                'role' => 'accountant',
                'phone' => '+8801711000008',
            ],
            [
                'name' => 'Front Desk Reception Officer',
                'email' => 'reception@hospital.local',
                'role' => 'receptionist',
                'phone' => '+8801711000009',
            ],
            [
                'name' => 'Md. Rahim Uddin',
                'email' => 'patient@hospital.local',
                'role' => 'patient',
                'phone' => '+8801711000010',
            ],
        ];

        foreach ($demoUsers as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => $defaultPassword,
                    'role' => $userData['role'],
                    'status' => 'active',
                    'phone' => $userData['phone'],
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
