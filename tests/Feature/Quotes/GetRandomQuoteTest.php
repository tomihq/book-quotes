<?php
namespace Tests\Feature\Settings;
use Tests\TestCase;
use App\Models\User;
use App\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GetRandomQuoteTest extends TestCase  {
    use RefreshDatabase;

    private array $quotes;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actingAs(User::factory()->create([
            'email_verified_at' => now(),
        ]));

        $this->quotes = [
            Quote::factory()->create([
                'text' => 'First quote',
                'author' => 'Author One',
                'book' => 'Book One',
            ]),
            Quote::factory()->create([
                'text' => 'Second quote',
                'author' => 'Author Two',
                'book' => 'Book Two',
            ]),
            Quote::factory()->create([
                'text' => 'Third quote',
                'author' => 'Author Three',
                'book' => 'Book Three',
            ]),
        ];
    }

    public function test_get_random_quote()
    {
        $response = $this->get('/quotes');
        
        $response->assertOk();
        $response->assertJsonStructure([
            'id',
            'text',
            'author',
            'book',
            'page',
            'created_at',
            'updated_at',
        ]);
        
        $returnedQuote = $response->json();
        $quoteIds = array_map(fn($quote) => $quote->id, $this->quotes);
        $this->assertContains($returnedQuote['id'], $quoteIds);
    }
}

