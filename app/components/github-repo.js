import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  inject
} = Ember;

export default Ember.Component.extend({
  ajax: inject.service(),

  tab: 'info',

  init() {
    this._super(...arguments);

    let url = this.get('url');

    this.get('fetchRepo').perform(url);
  },

  url: computed('repo', function(){
    let repo = this.get('repo');

    return `https://api.github.com/repos/${repo}`;
  }),

  fetchRepo: task(function *(url){

    let result = yield this.get('ajax').request(url);

    this.set('data', result);
  }),

  openIssues: computed.oneWay('data.open_issues'),
  organization: computed.oneWay('data.organization.login'),

  showInfo: computed.equal('tab', 'info'),
  showIssues: computed.equal('tab', 'issues'),

  actions: {
    showTab(name) {
      this.set('tab', name);
    }
  }
});
