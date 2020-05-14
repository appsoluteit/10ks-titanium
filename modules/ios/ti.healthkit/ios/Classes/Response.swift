//
//  ArgumentException.swift
//  TiHealthkit
//
//  Created by Appcelerator Developer on 14/5/20.
//

import Foundation

// This seems to fail with boundBridge:withKrollObject
// Might be easier to just return JSON instead?
public class Response: NSObject {
    public let Message: String
    public let Success: Bool
    
    init(success: Bool, message: String) {
        self.Success = success
        self.Message = message
    }
}
