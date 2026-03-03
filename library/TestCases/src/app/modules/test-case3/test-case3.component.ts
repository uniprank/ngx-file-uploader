import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'uni-test-case3',
    standalone: true,
    imports: [MarkdownComponent],
    templateUrl: './test-case3.component.html',
    styleUrls: ['./test-case3.component.scss']
})
export class TestCase3Component implements OnInit {
    public markdown: string = '';

    constructor(private _httpClient: HttpClient) {}

    ngOnInit() {
        this._httpClient.get('assets/docs/test-case3/README.md', { responseType: 'text' }).subscribe(content => {
            this.markdown = content;
        });
    }
}
