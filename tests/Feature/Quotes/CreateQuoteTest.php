<?php
namespace Tests\Feature\Settings;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreateQuoteTest extends TestCase  {
    use RefreshDatabase;
    public function test_can_create_a_quote()
    {
        $this->actingAs(User::factory()->create([
            'email_verified_at' => now(),
        ]));
    

        $payload = [
            'text' => 'It is our choices that show what we truly are.',
            'author' => 'J.K. Rowling',
            'book' => 'Harry Potter and the Chamber of Secrets',
            'page' => 333,
        ];

        $response = $this->post('/quotes', $payload);

        $response->assertRedirect(route('quotes.index'));
        $this->assertDatabaseHas('quotes', $payload);
    }
}

