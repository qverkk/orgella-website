module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://185.204.194.214:8011/:path*",
      },
    ];
  },
};
