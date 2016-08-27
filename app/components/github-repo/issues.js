import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  inject: { service },
  assign
} = Ember;



export default Ember.Component.extend({
  ajax: service(),
  
  init() {
    this._super(...arguments);

    this.setProperties({
      issues: [],
      selected: []
    });

    this.get('fetchIssues').perform();
  },
  
  url: computed('repo', function(){
    let repo = this.get('repo');
    return `https://api.github.com/repos/${repo}/issues`;
  }),

  fetchIssues: task(function *() {
    let url = this.get('url');
    let result = yield this.get('ajax').request(url);

    this.set('issues', result);
  }),

  issuesWithSelection: computed('issues.[]', 'selected.[]', function(){
    let selected = this.get('selected');

    return this.get('issues').map((issue) => {
      return assign({}, issue, {
        original: issue,
        isSelected: selected.includes(issue)
      });
    });
  }),

  actions: {
    toggleSelection(issue) {
      let selected = this.get('selected');

      if (selected.includes(issue)) {
        selected.removeObject(issue);
      } else {
        selected.pushObject(issue);
      }
    }
  }
});
