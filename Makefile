
VERSION := $$(cat extension/manifest.json | jq .version | tr -d \")

.PHONY: pack version

pack:
	zip -r topshot-toolkit-${VERSION}.zip extension

version:
	@echo ${VERSION}