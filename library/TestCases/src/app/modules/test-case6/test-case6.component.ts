import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'uni-test-case6',
    standalone: true,
    imports: [MarkdownComponent],
    templateUrl: './test-case6.component.html',
    styleUrls: ['./test-case6.component.scss']
})
export class TestCase6Component implements OnInit {
    public markdown: string = '';

    constructor(private _httpClient: HttpClient) {}

    ngOnInit() {
        this._httpClient.get('assets/docs/test-case6/README.md', { responseType: 'text' }).subscribe(content => {
            this.markdown = content;
        });
    }
}
