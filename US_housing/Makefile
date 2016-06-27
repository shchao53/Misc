clean:
	rm -rf -- res/us.json res/states.json res/counties.json

res/gz_2010_us_050_00_20m.zip:
	mkdir -p $(dir $@)
	curl -o $@ http://www2.census.gov/geo/tiger/GENZ2010/$(notdir $@)

res/gz_2010_us_050_00_20m.shp: res/gz_2010_us_050_00_20m.zip
	unzip -od $(dir $@) $<
	touch $@

res/counties.json: res/gz_2010_us_050_00_20m.shp py/HZVI_counties_data.csv
	topojson \
		-o $@ \
		--id-property='STATE+COUNTY,Id2' \
		--external-properties=py/HZVI_counties_data.csv  \
		--properties='name=Geography' \
		--properties='price=d.properties["HZVI"]' \
		--projection='width = 960, height = 600, d3.geo.albersUsa() \
			.scale(1280) \
			.translate([width / 2, height / 2])' \
		--simplify=.5 \
		-- counties=$<

res/states.json: res/counties.json
	topojson-merge \
		-o $@ \
		--in-object=counties \
		--out-object=states \
	        --key='d.id.substring(0, 2)' \
		-- $<

res/us.json: res/states.json
	topojson-merge \
		-o $@ \
		--in-object=states \
		--out-object=nation \
		-- $<
