import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = process.env.NODE_ENV ? true : false;

const dev = !production;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/rjql/rjql-doc.js'
	},
	plugins: [

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('public/rjql/rjql-doc.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		dev && serve(),

		dev && livereload({
			watch: 'public',
			port: 2334
		}),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		syncWithBackendPublic()


	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}

function syncWithBackendPublic() {
	console.log('Syncing RJQL DOC with backend static resources for PROD');
	require('ncp').ncp('public', '../simplifyr-backend/public/doc', function (err) {
		console.log(err ? 'Sync up failed!' + err : 'Sync up successfull for PROD!');

		console.log('Syncing RJQL DOC with backend static resources for DEV');
		require('ncp').ncp('public', '../simplifyr/public/doc', function (err) {
			console.log(err ? 'Sync up failed!' + err : 'Sync up successfull for DEV!');
		});
	});


}