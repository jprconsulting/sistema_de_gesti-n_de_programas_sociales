import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

import Histogram from 'highcharts/modules/histogram-bellcurve';
Histogram(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

const Wordcloud = require('highcharts/modules/wordcloud');
Wordcloud(Highcharts);

@Component({
  selector: 'app-nube-palabras',
  templateUrl: './nube-palabras.component.html',
  styleUrls: ['./nube-palabras.component.css']
})
export class NubePalabrasComponent implements OnInit {
  options: any;

  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.updateHeaderTitle('Nube de palabras');
    const data =
    [{
        name: 'people',
        weight: 31
    }, {
        name: 'intelligence',
        weight: 15
    }, {
        name: 'more',
        weight: 12
    }, {
        name: 'theory',
        weight: 12
    }, {
        name: 'theory',
        weight: 11
    }, {
        name: 'problem',
        weight: 11
    }, {
        name: 'thinking',
        weight: 11
    }, {
        name: 'been',
        weight: 11
    }, {
        name: 'can',
        weight: 11
    }, {
        name: 'process',
        weight: 11
    }, {
        name: 'new',
        weight: 10
    }, {
        name: 'individual',
        weight: 10
    }, {
        name: 'model',
        weight: 10
    }, {
        name: 'ideas',
        weight: 9
    }, {
        name: 'levels',
        weight: 9
    }, {
        name: 'processes',
        weight: 9
    }, {
        name: 'different',
        weight: 9
    }, {
        name: 'high',
        weight: 9
    }, {
        name: 'motivation',
        weight: 9
    }, {
        name: 'research',
        weight: 9
    }, {
        name: 'work',
        weight: 8
    }, {
        name: 'cognitive',
        weight: 8
    }, {
        name: 'team',
        weight: 8
    }, {
        name: 'divergent',
        weight: 8
    }, {
        name: 'tests',
        weight: 8
    }, {
        name: 'study',
        weight: 8
    }, {
        name: 'measures',
        weight: 8
    }, {
        name: 'theories',
        weight: 8
    }, {
        name: 'found',
        weight: 8
    }, {
        name: 'solving',
        weight: 7
    }, {
        name: 'knowledge',
        weight: 7
    }, {
        name: 'iq',
        weight: 7
    }, {
        name: 'working',
        weight: 7
    }, {
        name: 'positive',
        weight: 7
    }, {
        name: 'idea',
        weight: 7
    }, {
        name: 'studies',
        weight: 7
    }, {
        name: 'number',
        weight: 7
    }, {
        name: 'person',
        weight: 7
    }, {
        name: 'researchers',
        weight: 7
    }, {
        name: 'task',
        weight: 7
    }, {
        name: 'affect',
        weight: 7
    }, {
        name: 'group',
        weight: 7
    }, {
        name: 'memory',
        weight: 7
    }, {
        name: 'creation',
        weight: 7
    }, {
        name: 'individuals',
        weight: 7
    }, {
        name: 'concept',
        weight: 7
    }, {
        name: 'learning',
        weight: 7
    }, {
        name: 'given',
        weight: 7
    }, {
        name: 'ability',
        weight: 7
    }, {
        name: 'approach',
        weight: 7
    }, {
        name: 'innovation',
        weight: 7
    }, {
        name: 'malevolent',
        weight: 7
    }, {
        name: 'most',
        weight: 7
    }, {
        name: 'frontal',
        weight: 6
    }, {
        name: 'related',
        weight: 6
    }, {
        name: 'data',
        weight: 6
    }, {
        name: 'reported',
        weight: 6
    }, {
        name: 'incubation',
        weight: 6
    }, {
        name: 'thought',
        weight: 6
    }, {
        name: 'intrinsic',
        weight: 6
    }, {
        name: 'used',
        weight: 6
    }, {
        name: 'implicit',
        weight: 6
    }, {
        name: 'increase',
        weight: 6
    }, {
        name: 'general',
        weight: 6
    }, {
        name: 'mental',
        weight: 6
    }, {
        name: 'early',
        weight: 6
    }, {
        name: 'economic',
        weight: 6
    }, {
        name: 'level',
        weight: 6
    }, {
        name: 'students',
        weight: 6
    }, {
        name: 'human',
        weight: 6
    }, {
        name: 'constructs',
        weight: 6
    }, {
        name: 'problems',
        weight: 6
    }, {
        name: 'elements',
        weight: 6
    }, {
        name: 'proposed',
        weight: 6
    }, {
        name: 'lobe',
        weight: 6
    }, {
        name: 'participants',
        weight: 6
    }, {
        name: 'according',
        weight: 6
    }, {
        name: 'key',
        weight: 6
    }, {
        name: 'century',
        weight: 6
    }, {
        name: 'type',
        weight: 6
    }, {
        name: 'skills',
        weight: 6
    }, {
        name: 'relationship',
        weight: 6
    }, {
        name: 'will',
        weight: 6
    }, {
        name: 'environment',
        weight: 6
    }, {
        name: 'time',
        weight: 6
    }, {
        name: 'view',
        weight: 6
    }, {
        name: 'create',
        weight: 6
    }, {
        name: 'worldview',
        weight: 6
    }, {
        name: 'processing',
        weight: 6
    }, {
        name: 'seen',
        weight: 6
    }, {
        name: 'aggression',
        weight: 6
    }, {
        name: 'result',
        weight: 6
    }, {
        name: 'correlation',
        weight: 6
    }];


    this.options = {
      series: [{
        rotation: {
            from: -60,
            to: 60,
            orientations: 5
        },
        type: 'wordcloud',
        data: data
    }],
    title: {
        text: ''
    },

    subtitle: {
        text: ''
    }
    };
  }

  ngOnInit() {
    Highcharts.chart('container', this.options);
  }
}
