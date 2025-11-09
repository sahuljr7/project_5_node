const fs = require('fs').promises; // For promise-based methods
const fsCallback = require('fs'); // For callback-based methods

console.log('Project 5: Async Operations and Callbacks');
console.log('='.repeat(60));

// Sample files to read
const files = ['file1.txt', 'file2.txt', 'file3.txt'];

// ============================================================================
// 1. CALLBACK-BASED APPROACH
// ============================================================================

function readFileWithCallback(filename, callback) {
    console.log(`\n1. CALLBACK: Reading ${filename}...`);
    fsCallback.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
}

function demonstrateCallbacks() {
    console.log('\nDEMONSTRATING CALLBACK-BASED APPROACH');
    console.log('-'.repeat(50));
    
    // Read first file with callback
    readFileWithCallback('file1.txt', (err, data) => {
        if (err) {
            console.error('Callback Error:', err.message);
            return;
        }
        console.log('Callback Success - File 1 content preview:', data.substring(0, 50) + '...');
        
        // Nested callback for second file (callback hell example)
        readFileWithCallback('file2.txt', (err, data2) => {
            if (err) {
                console.error('Callback Error:', err.message);
                return;
            }
            console.log('Callback Success - File 2 content preview:', data2.substring(0, 50) + '...');
        });
    });
}

// ============================================================================
// 2. PROMISE-BASED APPROACH
// ============================================================================

function readFileWithPromises(filename) {
    console.log(`\n2. PROMISE: Reading ${filename}...`);
    return fs.readFile(filename, 'utf8')
        .then(data => {
            console.log(`Promise resolved for ${filename}`);
            return data;
        })
        .catch(error => {
            console.error(`Promise rejected for ${filename}:`, error.message);
            throw error;
        });
}

function demonstratePromises() {
    console.log('\nDEMONSTRATING PROMISE-BASED APPROACH');
    console.log('-'.repeat(50));
    
    // Chain promises
    readFileWithPromises('file1.txt')
        .then(data1 => {
            console.log('Promise - File 1 preview:', data1.substring(0, 50) + '...');
            return readFileWithPromises('file2.txt');
        })
        .then(data2 => {
            console.log('Promise - File 2 preview:', data2.substring(0, 50) + '...');
            return readFileWithPromises('file3.txt');
        })
        .then(data3 => {
            console.log('Promise - File 3 preview:', data3.substring(0, 50) + '...');
            console.log('All promises completed successfully!');
        })
        .catch(error => {
            console.error('Promise chain error:', error.message);
        });
}

// ============================================================================
// 3. ASYNC/AWAIT APPROACH
// ============================================================================

async function readFileWithAsyncAwait(filename) {
    console.log(`\n3. ASYNC/AWAIT: Reading ${filename}...`);
    try {
        const data = await fs.readFile(filename, 'utf8');
        console.log(`Async/await completed for ${filename}`);
        return data;
    } catch (error) {
        console.error(`Async/await error for ${filename}:`, error.message);
        throw error;
    }
}

async function demonstrateAsyncAwait() {
    console.log('\nDEMONSTRATING ASYNC/AWAIT APPROACH');
    console.log('-'.repeat(50));
    
    try {
        const data1 = await readFileWithAsyncAwait('file1.txt');
        console.log('Async/Await - File 1 preview:', data1.substring(0, 50) + '...');
        
        const data2 = await readFileWithAsyncAwait('file2.txt');
        console.log('Async/Await - File 2 preview:', data2.substring(0, 50) + '...');
        
        const data3 = await readFileWithAsyncAwait('file3.txt');
        console.log('Async/Await - File 3 preview:', data3.substring(0, 50) + '...');
        
        console.log('All async/await operations completed!');
    } catch (error) {
        console.error('Async/await error:', error.message);
    }
}

// ============================================================================
// 4. SEQUENTIAL FILE READING WITH ASYNC/AWAIT
// ============================================================================

async function readMultipleFilesSequentially(fileList) {
    console.log('\nDEMONSTRATING SEQUENTIAL FILE READING');
    console.log('-'.repeat(50));
    console.log(`Reading ${fileList.length} files sequentially...`);
    
    const results = [];
    
    for (let i = 0; i < fileList.length; i++) {
        const filename = fileList[i];
        console.log(`\n${i + 1}/${fileList.length}: Reading ${filename}...`);
        
        try {
            const content = await fs.readFile(filename, 'utf8');
            results.push({
                filename: filename,
                content: content,
                length: content.length,
                preview: content.substring(0, 60) + '...'
            });
            console.log(`Successfully read ${filename} (${content.length} characters)`);
        } catch (error) {
            console.error(`Failed to read ${filename}:`, error.message);
            results.push({
                filename: filename,
                error: error.message
            });
        }
    }
    
    return results;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
    console.log('Starting Async Operations Demonstration\n');
    
    // 1. Callback approach (with setTimeout to separate output)
    setTimeout(demonstrateCallbacks, 100);
    
    // 2. Promise approach
    setTimeout(demonstratePromises, 1000);
    
    // 3. Async/await approach
    setTimeout(async () => {
        await demonstrateAsyncAwait();
        
        // 4. Sequential file reading
        const sequentialResults = await readMultipleFilesSequentially(files);
        
        console.log('\n' + '='.repeat(60));
        console.log('SEQUENTIAL READING RESULTS:');
        console.log('-'.repeat(30));
        sequentialResults.forEach((result, index) => {
            if (result.error) {
                console.log(`${index + 1}. ${result.filename}: ERROR - ${result.error}`);
            } else {
                console.log(`${index + 1}. ${result.filename}: ${result.length} chars - "${result.preview}"`);
            }
        });
        
        console.log('\n' + '='.repeat(60));
        console.log('All async operations completed successfully!');
        console.log('Check the comparison write-up below for differences between approaches.');
    }, 2000);
}

// Start the demonstration
main().catch(error => {
    console.error('Main function error:', error);
});
