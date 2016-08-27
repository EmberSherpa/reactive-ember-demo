import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  inject: { service }
} = Ember;



export default Ember.Component.extend({
  ajax: service(),
  init() {
    this._super(...arguments);

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
  })
});
