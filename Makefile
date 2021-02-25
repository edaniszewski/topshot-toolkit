
VERSION := 0.1.0

.PHONY: pack

pack:
	zip -r topshot-toolkit-${VERSION}.zip extension
