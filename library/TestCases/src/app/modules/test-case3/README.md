You can find the complete test case at GitHub. [Test Case 3](https://github.com/uniprank/ngx-scrollspy/tree/master/library/TestCases/src/app/modules/test-case3)

## TestCase3Component

```js
@Component({
    selector: 'app-test-case3',
    templateUrl: './test-case3.component.html',
    styleUrls: ['./test-case3.component.scss']
})
export class TestCase3Component implements OnInit, OnDestroy {
    public activeSection: BehaviorSubject<{ id?: string; elementId?: string; nativeElement?: HTMLElement }> = new BehaviorSubject({});

    private _subscription: Subscription;

    constructor(private _scrollSpyService: ScrollSpyService) {}

    ngOnInit() {
        // set offset because 2 sticky menu bars width single height of 50px
        this._scrollSpyService.setOffset('window', 100);
        // subscribe to window scroll listener, it is also possible to use an ScrollSpyElement id
        this._subscription = this._scrollSpyService.observe('window').subscribe(item => {
            if (item != null) {
                const _nextSection = {
                    id: item.id,
                    elementId: item.scrollElementId
                };
                this.activeSection.next(_nextSection);
                console.info(`ScrollSpyService: item:`, item);
            }
        });
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
```

## TestCase3Component HTML

```html
<nav>
    <ul>
        <li uniScrollItem="section1">Section 1</li>
        <li uniScrollItem="section2">Section 2</li>
        <li uniScrollItem="section3">Section 3</li>
        <li uniScrollItem="section4">Section 4</li>
        <li>
            Active Section: [ <span [innerHtml]="(activeSection | async).id"></span>,
            <span [innerHtml]="(activeSection | async).elementId"></span> ]
        </li>
    </ul>
</nav>
<section uniScrollSpy="section1"></section>
<section uniScrollSpy="section2"></section>
<section uniScrollSpy="section3"></section>
<section uniScrollSpy="section4"></section>
```
