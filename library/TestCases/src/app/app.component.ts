import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

type Theme = 'auto' | 'light' | 'dark';

@Component({
    selector: 'uni-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    theme: Theme = 'auto';

    constructor(private router: Router) {
        const path = localStorage.getItem('path');
        if (path) {
            localStorage.removeItem('path');
            this.router.navigate([path]);
        }

        this.theme = (localStorage.getItem('theme') as Theme) || 'auto';
        this.applyTheme();
    }

    setTheme(theme: Theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }

    private applyTheme() {
        const html = document.documentElement;
        if (this.theme === 'auto') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', this.theme);
        }
    }
}
