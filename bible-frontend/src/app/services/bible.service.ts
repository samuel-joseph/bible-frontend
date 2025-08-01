import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Verse{
  verse: number,
  text: string
}

export interface BibleVerse{
  reference: string,
  verses: Verse[]
}

@Injectable({
  providedIn: 'root'
})
export class BibleService {

  private baseUrl = environment.bibleApiUrl;

  constructor(private http: HttpClient) { }

  getProverbOfTheDay(): Observable<BibleVerse> {
    return this.http.get<BibleVerse>(`${this.baseUrl}/proverbs`);
  }

  getVerseByReference(ref: string): Observable<BibleVerse> {
    return this.http.get<BibleVerse>(`${this.baseUrl}/verse?reference=${encodeURIComponent(ref)}`);
  }

  getOldTestamentBooks(): string[] {
  return [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ];
  }
  
  getNewTestamentBooks(): string[] {
  return [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
    '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
  ];
}
}
