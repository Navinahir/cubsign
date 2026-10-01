<?php

namespace Database\Seeders;

use App\Enums\BlogCategoryStatus;
use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'slug'        => 'getting-started',
                'name'        => 'Getting Started',
                'description' => 'First steps with CubSign and online PDF signing.',
                'color'       => 'from-blue-600 to-indigo-700',
            ],
            [
                'slug'        => 'pdf-signing',
                'name'        => 'PDF Signing',
                'description' => 'How to sign, send, and manage PDF documents.',
                'color'       => 'from-cyan-600 to-blue-700',
            ],
            [
                'slug'        => 'electronic-signatures',
                'name'        => 'Electronic Signatures',
                'description' => 'What e-signatures are and how they work in practice.',
                'color'       => 'from-emerald-600 to-teal-700',
            ],
            [
                'slug'        => 'security',
                'name'        => 'Security',
                'description' => 'Encryption, access control, and document protection.',
                'color'       => 'from-rose-600 to-orange-700',
            ],
            [
                'slug'        => 'business',
                'name'        => 'Business',
                'description' => 'Productivity and paperless workflows for teams.',
                'color'       => 'from-amber-500 to-orange-600',
            ],
            [
                'slug'        => 'product-updates',
                'name'        => 'Product Updates',
                'description' => 'What is new in CubSign Early Access.',
                'color'       => 'from-violet-600 to-purple-700',
            ],
            [
                'slug'        => 'guides',
                'name'        => 'Guides',
                'description' => 'Step-by-step tutorials and best practices.',
                'color'       => 'from-sky-600 to-blue-700',
            ],
            [
                'slug'        => 'legal',
                'name'        => 'Legal',
                'description' => 'Legality, compliance basics, and contract signing.',
                'color'       => 'from-slate-600 to-gray-800',
            ],
        ];

        foreach ($categories as $category) {
            BlogCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    ...$category,
                    'status' => BlogCategoryStatus::Active,
                ],
            );
        }
    }
}
