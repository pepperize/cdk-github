import { filter, flatten } from "../../src/custom-resource-provider/handler.lambda";

describe("handler", () => {
  describe("filter", () => {
    it("Should filter single object key", () => {
      // When
      const result = filter(flatten(responseFixture), ["data.id"]);

      // Then
      expect(result).toEqual({ "data.id": 558617288 });
      expect(result).not.toMatchObject({ "data.organization.id": 60035171 });
      expect(result).not.toMatchObject({ status: 201 });
    });
    it("Should filter by path starting with", () => {
      // When
      const result = filter(flatten(responseFixture), ["data."]);

      // Then
      expect(result).toMatchObject({ "data.id": 558617288 });
      expect(result).toMatchObject({ "data.organization.id": 60035171 });
      expect(result).not.toMatchObject({ status: 201 });
    });
    it("Should not filter", () => {
      // When
      const result = filter(flatten(responseFixture), undefined);

      // Then
      expect(result).toMatchObject({ "data.id": 558617288 });
      expect(result).toMatchObject({ "data.organization.id": 60035171 });
      expect(result).toMatchObject({ status: 201 });
    });
    it("Should filter all", () => {
      // When
      const result = filter(flatten(responseFixture), []);

      // Then
      expect(result).toEqual({});
    });
  });

  describe("flatten", () => {
    it("Should flatten object keys to materialized paths", () => {
      // When
      const result = flatten(responseFixture);

      // Then
      expect(result).toMatchObject({ "data.id": 558617288, "data.organization.id": 60035171 });
    });

    it("Should return object", () => {
      // Given
      const given = {};

      // When
      const result = flatten(given);

      // Then
      expect(result).toEqual({});
    });
  });

  const responseFixture = {
    status: 201,
    url: "https://api.github.com/orgs/pepperize/repos",
    headers: {
      "access-control-allow-origin": "*",
      "access-control-expose-headers":
        "ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset",
      "cache-control": "private, max-age=60, s-maxage=60",
      connection: "close",
      "content-length": "7327",
      "content-security-policy": "default-src 'none'",
      "content-type": "application/json; charset=utf-8",
      date: "Thu, 27 Oct 2022 23:18:59 GMT",
      etag: '"1abef344aadd35e96a41abcbe5b58f065855bd95bad5eb4d735fc63e39bbfb56"',
      location: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test",
      "referrer-policy": "origin-when-cross-origin, strict-origin-when-cross-origin",
      server: "GitHub.com",
      "strict-transport-security": "max-age=31536000; includeSubdomains; preload",
      vary: "Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With",
      "x-content-type-options": "nosniff",
      "x-frame-options": "deny",
      "x-github-media-type": "github.v3; format=json",
      "x-github-request-id": "9056:0EF3:35A40CF:6E51D7A:635B11E1",
      "x-ratelimit-limit": "5200",
      "x-ratelimit-remaining": "5194",
      "x-ratelimit-reset": "1666913981",
      "x-ratelimit-resource": "core",
      "x-ratelimit-used": "6",
      "x-xss-protection": "0",
    },
    data: {
      id: 558617288,
      node_id: "R_kgDOIUvSyA",
      name: "cdk-github-custom-resource-test",
      full_name: "pepperize/cdk-github-custom-resource-test",
      private: false,
      owner: {
        login: "pepperize",
        id: 60035171,
        node_id: "MDEyOk9yZ2FuaXphdGlvbjYwMDM1MTcx",
        avatar_url: "https://avatars.githubusercontent.com/u/60035171?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/pepperize",
        html_url: "https://github.com/pepperize",
        followers_url: "https://api.github.com/users/pepperize/followers",
        following_url: "https://api.github.com/users/pepperize/following{/other_user}",
        gists_url: "https://api.github.com/users/pepperize/gists{/gist_id}",
        starred_url: "https://api.github.com/users/pepperize/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/pepperize/subscriptions",
        organizations_url: "https://api.github.com/users/pepperize/orgs",
        repos_url: "https://api.github.com/users/pepperize/repos",
        events_url: "https://api.github.com/users/pepperize/events{/privacy}",
        received_events_url: "https://api.github.com/users/pepperize/received_events",
        type: "Organization",
        site_admin: false,
      },
      html_url: "https://github.com/pepperize/cdk-github-custom-resource-test",
      description: null,
      fork: false,
      url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test",
      forks_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/forks",
      keys_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/keys{/key_id}",
      collaborators_url:
        "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/collaborators{/collaborator}",
      teams_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/teams",
      hooks_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/hooks",
      issue_events_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/issues/events{/number}",
      events_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/events",
      assignees_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/assignees{/user}",
      branches_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/branches{/branch}",
      tags_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/tags",
      blobs_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/git/blobs{/sha}",
      git_tags_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/git/tags{/sha}",
      git_refs_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/git/refs{/sha}",
      trees_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/git/trees{/sha}",
      statuses_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/statuses/{sha}",
      languages_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/languages",
      stargazers_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/stargazers",
      contributors_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/contributors",
      subscribers_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/subscribers",
      subscription_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/subscription",
      commits_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/commits{/sha}",
      git_commits_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/git/commits{/sha}",
      comments_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/comments{/number}",
      issue_comment_url:
        "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/issues/comments{/number}",
      contents_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/contents/{+path}",
      compare_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/compare/{base}...{head}",
      merges_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/merges",
      archive_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/{archive_format}{/ref}",
      downloads_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/downloads",
      issues_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/issues{/number}",
      pulls_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/pulls{/number}",
      milestones_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/milestones{/number}",
      notifications_url:
        "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/notifications{?since,all,participating}",
      labels_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/labels{/name}",
      releases_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/releases{/id}",
      deployments_url: "https://api.github.com/repos/pepperize/cdk-github-custom-resource-test/deployments",
      created_at: "2022-10-27T23:18:58Z",
      updated_at: "2022-10-27T23:18:58Z",
      pushed_at: "2022-10-27T23:18:58Z",
      git_url: "git://github.com/pepperize/cdk-github-custom-resource-test.git",
      ssh_url: "git@github.com:pepperize/cdk-github-custom-resource-test.git",
      clone_url: "https://github.com/pepperize/cdk-github-custom-resource-test.git",
      svn_url: "https://github.com/pepperize/cdk-github-custom-resource-test",
      homepage: null,
      size: 0,
      stargazers_count: 0,
      watchers_count: 0,
      language: null,
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      forks_count: 0,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 0,
      license: null,
      allow_forking: true,
      is_template: false,
      web_commit_signoff_required: false,
      topics: [],
      visibility: "public",
      forks: 0,
      open_issues: 0,
      watchers: 0,
      default_branch: "main",
      permissions: {
        admin: false,
        maintain: false,
        push: false,
        triage: false,
        pull: false,
      },
      allow_squash_merge: true,
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      delete_branch_on_merge: false,
      allow_update_branch: false,
      use_squash_pr_title_as_default: false,
      squash_merge_commit_message: "COMMIT_MESSAGES",
      squash_merge_commit_title: "COMMIT_OR_PR_TITLE",
      merge_commit_message: "PR_TITLE",
      merge_commit_title: "MERGE_MESSAGE",
      organization: {
        login: "pepperize",
        id: 60035171,
        node_id: "MDEyOk9yZ2FuaXphdGlvbjYwMDM1MTcx",
        avatar_url: "https://avatars.githubusercontent.com/u/60035171?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/pepperize",
        html_url: "https://github.com/pepperize",
        followers_url: "https://api.github.com/users/pepperize/followers",
        following_url: "https://api.github.com/users/pepperize/following{/other_user}",
        gists_url: "https://api.github.com/users/pepperize/gists{/gist_id}",
        starred_url: "https://api.github.com/users/pepperize/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/pepperize/subscriptions",
        organizations_url: "https://api.github.com/users/pepperize/orgs",
        repos_url: "https://api.github.com/users/pepperize/repos",
        events_url: "https://api.github.com/users/pepperize/events{/privacy}",
        received_events_url: "https://api.github.com/users/pepperize/received_events",
        type: "Organization",
        site_admin: false,
      },
      network_count: 0,
      subscribers_count: 0,
    },
  };
});
