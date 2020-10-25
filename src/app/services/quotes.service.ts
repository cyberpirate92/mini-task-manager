import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class QuotesService {
    private quotes: Quote[] = [{
        quote: "You miss 100% of the shots you don't take.", 
        author: "Wayne Gretzky"
    },
    {
        quote: "Whether you think you can or you think you can't, you're right.", 
        author: "Henry Ford"
    },
    {
        quote: "I have learned over the years that when one's mind is made up, this diminishes fear.", 
        author: "Rosa Parks"
    },
    {
        quote: "I alone cannot change the world, but I can cast a stone across the water to create many ripples.", 
        author: "Mother Teresa"
    },
    {
        quote: "Nothing is impossible, the word itself says, ‘I'm possible!'", 
        author: "Audrey Hepburn"
    },
    {
        quote: "The question isn't who is going to let me; it's who is going to stop me.", 
        author: "Ayn Rand"
    },
    {
        quote: "The only person you are destined to become is the person you decide to be.", 
        author: "Ralph Waldo Emerson"
    }];

    public getRandomQuote(): Quote {
        return this.quotes[this.randomInteger(0, this.quotes.length)];
    }

    private randomInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export interface Quote {
    quote: string;
    author: string;
}