{pkgs ? import <nixpkgs> {}}:
with pkgs;
  mkShell {
    packages = with pkgs; [
      uv
      pyright
      nixpkgs-fmt

      (pkgs.python3.withPackages (python-pkgs: [
        python-pkgs.msgpack
        python-pkgs.numpy
        python-pkgs.sounddevice
        python-pkgs.websockets
        python-pkgs.google-api-python-client
      ]))
    ];
  }
