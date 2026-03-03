import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'uni-test-case4',
    standalone: true,
    imports: [MarkdownComponent],
    templateUrl: './test-case4.component.html',
    styleUrls: ['./test-case4.component.scss']
})
export class TestCase4Component implements OnInit {
    public markdown: string = '';

    constructor(private _httpClient: HttpClient) {}

    ngOnInit() {
        this._httpClient.get('assets/docs/test-case4/README.md', { responseType: 'text' }).subscribe(content => {
            this.markdown = content;
        });
    }
}
