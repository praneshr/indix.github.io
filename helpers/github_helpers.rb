module GithubHelpers

  @@contributors = {}
  def build_contributors(repo)
    return unless config[:github_auth]
    @@github = Github.new do |c|
      c.basic_auth = config[:github_auth]
    end
    @@repo_contributors = @@github.repos.contributors 'ind9', repo
    @@repo_contributors.each { |contributor|
      if @@contributors.key?(contributor.login)
        @@contributors[contributor.login].contributions += contributor.contributions
      else
        @@contributors[contributor.login] = contributor
      end
    }
  end
  def contributors
    @@contributors
  end

  def is_client_side
    config[:github_auth] == false
  end
end
