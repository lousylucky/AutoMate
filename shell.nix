{pkgs ? import <nixpkgs> {}}:
with pkgs;
  mkShell {
    packages = with pkgs; [
      uv
      pyright
      nixpkgs-fmt
    ];
  }
