@servers(['web' => 'jenkins@behatstaging.stagingarea.us'])

@task('deploy')
	cd /var/www/ba/
	git pull origin repeat_reorder_v2
@endtask
