$(function() {
  $.get('https://api.github.com/search/repositories?per_page=20&page=1&q=user:ind9&sort=stars', function(data) {
    if(!data) return;
    var repos = [];
    var contributors = {};
    data.items.forEach(function(repo) {
      var repoContainer = $('#' + repo.name);
      if(repoContainer.length > 0) {
        repos.push(repo.name);
        repoContainer.attr('href', repo.html_url);
        var description = $('<p>').text(repo.description);
        $('.panel-body', repoContainer).append(description);
        $('.language', repoContainer).text(repo.language);
        $('.stars', repoContainer).text(repo.stargazers_count);
        $('.forks', repoContainer).text(repo.forks);
      }
    });

    repos.forEach(function(repo) {
      $.get('https://api.github.com/repos/ind9/' + repo + '/contributors', function(data) {
        if(!data) return;

        data.forEach(function(contributor) {
          if(!contributors[contributor.login])
            contributors[contributor.login] = contributor;
        });
      });
    });
  });
});
