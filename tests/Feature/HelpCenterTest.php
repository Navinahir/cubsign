<?php

namespace Tests\Feature;

use Tests\TestCase;

class HelpCenterTest extends TestCase
{
    public function test_help_center_index_is_public(): void
    {
        $this->get('/help-center')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('HelpCenter'));
    }

    public function test_help_center_article_is_public(): void
    {
        $this->get('/help-center/how-to-upload-a-pdf')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('HelpArticle')
                ->where('slug', 'how-to-upload-a-pdf'));
    }
}
