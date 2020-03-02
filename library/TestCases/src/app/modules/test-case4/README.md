You can find the complete test case at GitHub. [Test Case 4](https://github.com/uniprank/ngx-scrollspy/tree/master/library/TestCases/src/app/modules/test-case4)

## InnerTestComponent HTML

```html
<nav>
    <ul>
        <li *ngFor="let section of showSection; let i=index" [ngClass]="{base: section.base}">
            <a *ngIf="section.id != null" [uniScrollItem]="section.id" [innerHtml]="section.name" href="#{{section.id}}"></a>
            <span *ngIf="section.id == null" [innerHtml]="section.name"></span>
        </li>
    </ul>
</nav>
```

```js
@Component({
    selector: 'app-inner-test',
    templateUrl: './inner-test.component.html',
    styleUrls: ['./inner-test.component.scss']
})
export class InnerTestComponent implements OnInit {
    @Input() sections: Array<{ id: string; name: string }> = [];

    showSection: Array<{ id: string; name: string; base: boolean }> = [];

    constructor() {}

    ngOnInit() {
        this.showSection = this._generateMenu();
    }

    private _generateMenu(): Array<{ id: string; name: string; base: boolean }> {
        const _sections: Array<{ id: string; name: string; base: boolean }> = [];
        _sections.push({
            id: null,
            name: 'Main category',
            base: true
        });
        for (let i = 1; i <= this.sections.length; i++) {
            if (i % 3 == 0) {
                _sections.push({
                    id: null,
                    name: 'Sub category ' + i / 3,
                    base: true
                });
            }
            _sections.push({
                id: this.sections[i - 1].id,
                name: this.sections[i - 1].name,
                base: false
            });
        }
        return _sections;
    }
}
```

## TestCase4Component

```js
@Component({
    selector: 'app-test-case4',
    templateUrl: './test-case4.component.html',
    styleUrls: ['./test-case4.component.scss']
})
export class TestCase4Component implements OnInit {
    public markdown = require('raw-loader!./README.md');
    public sections: Array<any> = [];

    constructor(private _scrollSpyService: ScrollSpyService) {}

    ngOnInit() {
        // set offset because sticky menu bar width single height of 50px
        this._scrollSpyService.setOffset('window', 50);
        const _sections = [];
        for (let i = 1; i <= 10; i++) {
            _sections.push({ id: `section${i}`, name: `Section ${i}` });
        }
        this.sections = _sections;
    }
}
```

## TestCase4Component HTML

```html
<div class="template">
    <app-inner-test [sections]="sections"></app-inner-test>
    <div>
        <section *ngFor="let section of sections; let i=index" [uniScrollSpy]="section.id" [ngClass]="['section' + ((i+1)%5)]">
            <h2 [innerHtml]="section.name"></h2>
        </section>
    </div>
</div>
```
