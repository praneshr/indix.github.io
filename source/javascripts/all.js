Array.prototype.eachSlice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

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

    var requests = [];
    repos.forEach(function(repo) {
      var request = $.get('https://api.github.com/repos/ind9/' + repo + '/contributors', function(data) {
        if(!data) return;

        data.forEach(function(contributor) {
          if(!contributors[contributor.login])
            contributors[contributor.login] = contributor;
        });
      });
      requests.push(request);
    });
    var allRequests = $.when.apply($, requests);
    allRequests.done(function() {
      var contributorsContainer = $('#contributors');
      Object.keys(contributors).eachSlice(6, function(row) {
        var rowContainer = $('<div class="row"></div>');
        row.forEach(function(contributor) {
          var contributorContainer = $('<div class="col-md-2 col-sm-4"><img class="contributor-image" src="' + contributors[contributor].avatar_url + '"/></div>');
          rowContainer.append(contributorContainer);
        });
        contributorsContainer.append(rowContainer);
      });
    })
  });

  $(window).scroll(function(e) {
    var bannerOffset = $('.banner').offset().top;
    var windowScroll = $(window).scrollTop();
    var navbar = $('.navbar');
    if (windowScroll >= (bannerOffset - 110)) {
      navbar.addClass('shrink');
    } else {
      navbar.removeClass('shrink');
    }
  });
});
