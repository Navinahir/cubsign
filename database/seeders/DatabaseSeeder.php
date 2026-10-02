<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::unguarded(function () {
            User::query()->updateOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name'              => 'Test User',
                    'password'          => 'password',
                    'email_verified_at' => now(),
                    'status'            => UserStatus::Active,
                    'role'              => UserRole::User,
                ],
            );

            User::query()->updateOrCreate(
                ['email' => 'admin@gmail.com'],
                [
                    'name'              => 'CubSign Product & Engineering Team',
                    'password'          => 'password',
                    'email_verified_at' => now(),
                    'status'            => UserStatus::Active,
                    'role'              => UserRole::Admin,
                ],
            );
        });

        $this->call([
            BlogCategorySeeder::class,
        ]);
    }
}
