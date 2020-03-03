You can find the complete test case at GitHub. [Test Case 5](https://github.com/uniprank/ngx-scrollspy/tree/master/library/TestCases/src/app/modules/test-case5)

## InnerTestComponent HTML

```html
<nav>
    <ul>
        <li>OnPush</li>
        <li *ngFor="let section of sections" [uniScrollItem]="section.id" [innerHtml]="section.name"></li>
    </ul>
</nav>
```

```js
@Component({
    selector: 'app-inner-test',
    templateUrl: './inner-test.component.html',
    styleUrls: ['./inner-test.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnerTestComponent implements OnInit {
    @Input() sections: Array<{ id: string, name: string }> = [];

    constructor() {}

    ngOnInit() {}
}
```

## TestCase5Component

```js
@Component({
    selector: 'app-test-case5',
    templateUrl: './test-case5.component.html',
    styleUrls: ['./test-case5.component.scss']
})
export class TestCase5Component implements OnInit {
    public sections: Array<any> = [];

    constructor(private _scrollSpyService: ScrollSpyService) {}

    ngOnInit() {
        // set offset because 2 sticky menu bars width single height of 50px
        this._scrollSpyService.setOffset('window', 100);
        setTimeout(() => {
            this.sections = [
                { id: 'section1', name: 'Section 1' },
                { id: 'section2', name: 'Section 2' },
                { id: 'section3', name: 'Section 3' }
            ];
        });
    }
}
```

## TestCase5Component HTML

```html
<nav>
    <ul>
        <li uniScrollItem="section1">Section 1</li>
        <li uniScrollItem="section2">Section 2</li>
        <li uniScrollItem="section3">Section 3</li>
        <li uniScrollItem="section4">Section 4</li>
    </ul>
</nav>
<section uniScrollSpy="section1"></section>
<section uniScrollSpy="section2"></section>
<section uniScrollSpy="section3"></section>
<section uniScrollSpy="section4"></section>

<app-inner-test [sections]="sections"></app-inner-test>
```
