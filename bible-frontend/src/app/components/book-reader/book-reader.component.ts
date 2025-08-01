import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BibleService, BibleVerse } from 'src/app/services/bible.service';

@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.scss']
})
export class BookReaderComponent implements OnInit {
  @Input() books: string[] | null = null;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  isLoading: boolean = false;
  selectedBook: string = '';
  verse?: BibleVerse;
  hasSavedProgress: boolean = false;

  constructor(private bibleService: BibleService) {}

  ngOnInit(): void {
    if (!this.books) {
      // Proverbs mode
      this.fetchVerses('Proverbs', 1);
      return;
    }

    const saved = this.getStoredChapter();
    this.hasSavedProgress = !!saved;

    if (saved && this.books.includes(saved.book)) {
      this.selectedBook = saved.book;
      this.fetchVerses(saved.book, saved.chapter + 1);
    }
  }

  onBookSelect(event: Event): void {
    const book = (event.target as HTMLSelectElement).value;
    if (book) {
      this.selectedBook = book;
      this.fetchVerses(book, 1);
    }
  }

fetchVerses(book: string, chapter: number): void {
  this.selectedBook = book;
  this.verse = undefined;
  this.isLoading = true; // Start loading

  if (this.books) {
    this.saveProgress(book, chapter);
  }

  this.bibleService.getVerseByReference(`${book} ${chapter}`).subscribe({
    next: (data) => {
      this.verse = data;
      this.isLoading = false; // Done loading
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Error loading verse:', err);
    }
  });
}

  saveProgress(book: string, chapter: number): void {
    const key = this.getStorageKey();
    const data = {
      book,
      chapter,
      ttl: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };
    localStorage.setItem(key, JSON.stringify(data));
    this.hasSavedProgress = true;
  }

  getStoredChapter(): { book: string, chapter: number } | null {
    const key = this.getStorageKey();
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    try {
      const data = JSON.parse(stored);
      if (!data.ttl || Date.now() > data.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return { book: data.book, chapter: data.chapter };
    } catch {
      return null;
    }
  }

  getStorageKey(): string {
    return `bible-progress-${this.title.toLowerCase().replace(/\s/g, '-')}`;
  }

  clearProgress(): void {
    localStorage.removeItem(this.getStorageKey());
    this.verse = undefined;
    this.selectedBook = '';
    this.hasSavedProgress = false;
  }

  closeComponent(): void {
    this.close.emit();
  }
}
