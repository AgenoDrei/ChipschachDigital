import {Component} from '@angular/core';

@Component({
    selector: 'menu',
    // template: `hi, I'm a menu`
    templateUrl: 'app/views/menu.html',
    styleUrls: ['app/styles/menu.css']
})
export class MenuComponent {
    imgs: Image[] = [
        {
            name: 'single',
            url: '../img/single.png'
        },
        {
            name: 'multiLocal',
            url: '../img/multi_lokal.png'
        },
        {
            name: 'multiGlobal',
            url: '../img/multi_lokal.png'
        },
        {
            name: 'mini',
            url: '../img/multi_lokal.png'
        },
        {
            name: 'classic',
            url: '../img/multi_lokal.png'
        },
        {
            name: 'editor',
            url: '../img/multi_lokal.png'
        },
        {
            name: 'exit',
            url: '../img/multi_lokal.png'
        }
    ]

}