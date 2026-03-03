import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'uni-test-case2',
    standalone: true,
    imports: [MarkdownComponent],
    templateUrl: './test-case2.component.html',
    styleUrls: ['./test-case2.component.scss']
})
export class TestCase2Component implements OnInit {
    public markdown: string = '';

    constructor(private _httpClient: HttpClient) {}

    ngOnInit() {
        this._httpClient.get('assets/docs/test-case2/README.md', { responseType: 'text' }).subscribe(content => {
            this.markdown = content;
        });
    }
}
