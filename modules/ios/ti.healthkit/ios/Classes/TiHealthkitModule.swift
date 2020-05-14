//
//  TiHealthkitModule.swift
//  ti.healthkit
//
//  Created by Jason Sultana
//  Copyright (c) 2020 Your Company. All rights reserved.
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
                
                self.invokeCallback(callback: callback, response: message)
                return
            }
            
            self.invokeCallback(callback: callback, response: "HealthKit Authorization Successful")
        }
    }
    
    func invokeCallback(callback: KrollCallback, response: String) {
        callback.call([["response": response]], thisObject: self)
    }
}
