import { Component } from '@angular/core';
import { BibleService } from './services/bible.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showProverb = false;
  showOld = false;
  showNew = false;
  showClearAll: boolean = false;

  showIntroMessage = false;
  showMenu = true;

  hiddenButtons = new Set<string>();
  fadingButtons = new Set<string>();
  lastVisited: 'proverb' | 'old' | 'new' | '' = '';

  constructor(public bibleService: BibleService) {
    const oldProgress = localStorage.getItem('bible-progress-old-testament');
    const newProgress = localStorage.getItem('bible-progress-new-testament');
    this.showClearAll = !!oldProgress || !!newProgress;

    const noProgress = !oldProgress && !newProgress;
    const introShown = sessionStorage.getItem('introShown');

    // Show intro only if no progress and not already shown this session
    if (noProgress && !introShown) {
      this.showIntroMessage = true;
      this.showMenu = false;
    }
  }

  openProverb() {
    this.resetView();
    this.showProverb = true;
    this.lastVisited = 'proverb';
    this.hideIntro();
  }

  openOldTestament() {
    this.resetView();
    this.showOld = true;
    this.lastVisited = 'old';
    this.hideIntro();
  }

  openNewTestament() {
    this.resetView();
    this.showNew = true;
    this.lastVisited = 'new';
    this.hideIntro();
  }

  handleClose() {
    this.resetView();

    if (this.lastVisited) {
      const section = this.lastVisited;
      this.fadingButtons.add(section);

      setTimeout(() => {
        this.fadingButtons.delete(section);
        this.hiddenButtons.add(section);
        this.lastVisited = '';
      }, 800); // Match your fade-out duration
    }

    // Recheck progress to toggle clear button
    const oldProgress = localStorage.getItem('bible-progress-old-testament');
    const newProgress = localStorage.getItem('bible-progress-new-testament');
    this.showClearAll = !!oldProgress || !!newProgress;

    this.showMenu = true;
  }

  dismissIntro() {
    this.hideIntro();
    this.showMenu = true;
  }

  hideIntro() {
    this.showIntroMessage = false;
    sessionStorage.setItem('introShown', 'true');
  }

  allButtonsGone(): boolean {
    return this.hiddenButtons.has('proverb') &&
           this.hiddenButtons.has('old') &&
           this.hiddenButtons.has('new');
  }

  private resetView() {
    this.showProverb = false;
    this.showOld = false;
    this.showNew = false;
    this.showMenu = false;
  }
}
