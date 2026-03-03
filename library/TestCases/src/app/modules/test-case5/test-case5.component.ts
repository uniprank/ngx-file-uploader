import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'uni-test-case5',
    standalone: true,
    imports: [MarkdownComponent],
    templateUrl: './test-case5.component.html',
    styleUrls: ['./test-case5.component.scss']
})
export class TestCase5Component implements OnInit {
    public markdown: string = '';

    constructor(private _httpClient: HttpClient) {}

    ngOnInit() {
        this._httpClient.get('assets/docs/test-case5/README.md', { responseType: 'text' }).subscribe(content => {
            this.markdown = content;
        });
    }
}
