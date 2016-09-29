Array.prototype.eachSlice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

$(function() {
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

  $.get('https://api.github.com/search/repositories?per_page=32&page=1&q=user:indix&sort=stars', function(data) {
    if(!data) return;

    var repos = [];
    var contributors = {};

    data.items.forEach(function(repo) {
      var repoContainer = $('[id="' + repo.name + '"]');
      if(repoContainer.length > 0) {
        repos.push(repo.name);
        repoContainer.attr('href', repo.homepage || repo.html_url);
        var description = $('<p>').text(repo.description);
        $('.panel-body', repoContainer).append(description);
        $('.language', repoContainer).text(repo.language);
        $('.stars', repoContainer).text(repo.stargazers_count);
        $('.forks', repoContainer).text(repo.forks);
      }
    });

    var contributorsContainer = $('#contributors');
    if(!contributorsContainer.data('is-client-side')) return;

    var requests = [];
    repos.forEach(function(repo) {
      var request = $.get('https://api.github.com/repos/indix/' + repo + '/contributors', function(data) {
        if(!data) return;

        data.forEach(function(contributor) {
          if(!contributors[contributor.login]) {
            contributors[contributor.login] = contributor;
          } else {
            contributors[contributor.login].contributions += contributor.contributions;
          }
        });
      });
      requests.push(request);
    });
    var allRequests = $.when.apply($, requests);
    allRequests.then(function() {
      Object.keys(contributors)
            .sort(function(a,b){return contributors[b].contributions-contributors[a].contributions})
            .eachSlice(6, function(row) {
              var rowContainer = $('<div class="row"></div>');
              row.forEach(function(contributor) {
                var contributorContainer = $('<div class="contributor col-md-2 col-sm-4 col-xs-6"><div class="wrapper">' +
                                             '<a href="' + contributors[contributor].html_url +
                                             '"><img class="contributor-image" src="' +
                                             contributors[contributor].avatar_url +
                                             '"/></a><p><span>' + contributors[contributor].contributions +
                                             '</span></p></div></div>');
                rowContainer.append(contributorContainer);
              });

              contributorsContainer.append(rowContainer);
            });
    }, function() {
      $('#contributors').remove();
    });
  });
});
