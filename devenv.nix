{
  pkgs,
  inputs,
  ...
}: let
  pkgs-unstable = import inputs.nixpkgs-unstable {
    system = pkgs.stdenv.system;
  };
in {
  packages = with pkgs; [
    pkg-config
    libsass
    zlib
    zola
    git
    ascii-image-converter
    pkgs-unstable.opencode
  ];

  languages.rust = {
    enable = true;
    channel = "stable";
    components = [
      "rustc"
      "cargo"
      "clippy"
      "rustfmt"
      "rust-analyzer"
      "rust-src"
    ];
  };
}
