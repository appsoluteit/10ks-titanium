//
//  TiHealthkitModule.swift
//  ti.healthkit
//
//  Created by Jason Sultana
//  Copyright (c) 2020 AppsoluteIT. All rights reserved.
//

import UIKit
import TitaniumKit

/**
 
 Titanium Swift Module Requirements
 ---
 
 1. Use the @objc annotation to expose your class to Objective-C (used by the Titanium core)
 2. Use the @objc annotation to expose your method to Objective-C as well.
 3. Method arguments always have the "[Any]" type, specifying a various number of arguments.
 Unwrap them like you would do in Swift, e.g. "guard let arguments = arguments, let message = arguments.first"
 4. You can use any public Titanium API like before, e.g. TiUtils. Remember the type safety of Swift, like Int vs Int32
 and NSString vs. String.
 
 */

@objc(TiHealthkitModule)
class TiHealthkitModule: TiModule {
    func moduleGUID() -> String {
        return "294b9204-6239-4d8e-9b07-e8590cd23800"
    }

    override func moduleId() -> String! {
        return "ti.healthkit"
    }

    override func startup() {
        super.startup()
        debugPrint("[DEBUG] \(self) loaded")
    }

    @objc(authoriseHealthKit:)
    func authoriseHealthKit(arguments: Array<Any>?) {
        guard let args = arguments,
              let callback = args[0] as? KrollCallback else { fatalError("Invalid parameters provided!") }

        let provider = HealthKitProvider()
        provider.authorizeHealthKit { (authorized, error) in
            guard authorized else {
                var message = "HealthKit Authorization Failed"

                if let error = error {
                    message = "\(message). Reason: \(error.localizedDescription)"
                }
                
                self.invokeCallback(callback: callback, response: [
                    "success": false,
                    "message": message
                ])
                
                return
            }
            
            self.invokeCallback(callback: callback, response: [
                "success": true,
                "message": "HealthKit Authorization Successful"
            ])
        }
    }
    
    @objc(querySteps:)
    func querySteps(arguments: Array<Any>?) {
        guard let args = arguments,
            let from = args[0] as? Date,
            let to = args[1] as? Date,
            let callback = args[2] as? KrollCallback else {
                fatalError("Invalid parameters provided!")
        }
        
        let provider = HealthKitProvider()
        provider.querySteps(start: from, end: to) { (success, errorText, steps) in
            
            // the module bridge has trouble returning complex types.
            // return it as JSON instead. Also note that by default,
            // the encoder will serialise the date using a `timeIntervalSinceReferenceDate`.
            // We may be best off specifying the encoder to use a different format.
            // https://www.raywenderlich.com/3418439-encoding-and-decoding-in-swift
            // https://developer.apple.com/documentation/foundation/nsdate/1417376-timeintervalsincereferencedate
            
            
            let encoder = JSONEncoder()
            encoder.dateEncodingStrategy = .formatted(.dateFormatter)
            let data = try? encoder.encode(steps)
            if let json = data {
                let result = String(data: json, encoding: .utf8)!
                self.invokeCallback(callback: callback, response: [
                    "success": success,
                    "result": result,
                    "message": errorText
                ])
            }
        }
    }
    
    // Pass a dictionary of values back to the caller. These will be transformed into a
    // response object
    func invokeCallback(callback: KrollCallback, response: [String: Any]) {
        callback.call([response], thisObject: self)
    }
}
