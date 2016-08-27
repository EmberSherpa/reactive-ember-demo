import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  inject: { service }
} = Ember;

export default Ember.Component.extend({
  ajax: service(),
  
  url: computed('repo', function(){
    let repo = this.get('repo');
    return `https://api.github.com/repos/${repo}/issues`;
  }),

  fetchIssues: task(function *(page) {
    let url = this.get('url');

    let result = yield this.get('ajax').request(`${url}?page=${page}`);

    this.set('issues', result);
  })
});